use rusqlite::{Connection, Result, params};
use serde_json::{Value, from_str, to_string, Map};
use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};
use uuid::Uuid;
use chrono::{Utc};

// Function to get the database path
fn get_db_path(app_handle: &AppHandle, collection: &str) -> PathBuf {
    let app_data_dir = app_handle.path().app_data_dir().expect("Failed to get app data dir");
    if !app_data_dir.exists() {
        fs::create_dir_all(&app_data_dir).expect("Failed to create app data directory");
    }
    app_data_dir.join(format!("{}.db", collection))
}

// Initialize a database connection for a specific collection
fn init_db(app_handle: &AppHandle, collection: &str) -> Result<Connection> {
    let db_path = get_db_path(app_handle, collection);
    let conn = Connection::open(&db_path)?;
    conn.execute(
        "CREATE TABLE IF NOT EXISTS documents (
            _id TEXT PRIMARY KEY,
            created_at TEXT NOT NULL,
            data TEXT NOT NULL
        )",
        [],
    )?;
    Ok(conn)
}

#[tauri::command]
pub fn nedb_find(app_handle: AppHandle, collection: String, query: Value) -> Result<Vec<Value>, String> {
    let conn = init_db(&app_handle, &collection).map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT data FROM documents WHERE 1=1")
        .map_err(|e| e.to_string())?;

    // Simple query parsing for now. In a real app, you'd want a more robust query builder.
    // For Nedb, often queries are simple key-value pairs or empty.
    let query_map = query.as_object().ok_or("Query must be an object")?;

    let mut sql_query = "SELECT data FROM documents WHERE 1=1".to_string();
    let mut query_params: Vec<(String, Value)> = Vec::new();

    for (key, value) in query_map {
        // For simplicity, only handle direct string/number equality for now.
        // Nedb supports more complex queries, which would require more sophisticated parsing.
        if value.is_string() || value.is_number() {
            sql_query.push_str(&format!(" AND json_extract(data, '$.{}') = ?{}", key, query_params.len() + 1));
            query_params.push((key.clone(), value.clone()));
        } else {
            // For other types, we'll just ignore them for now or you can implement more complex logic
            // For example, if the query is an empty object, it should return all documents.
        }
    }

    if query_map.is_empty() {
        // If the query is empty, return all documents
        let documents_str: Vec<String> = stmt.query_map(params![], |row| row.get(0))
            .map_err(|e| e.to_string())?
            .filter_map(std::result::Result::ok)
            .collect();
        
        let documents: Vec<Value> = documents_str.into_iter()
            .filter_map(|s| from_str(&s).ok())
            .collect();
        Ok(documents)
    } else {
        let mut params_vec: Vec<rusqlite::types::Value> = Vec::new();
        for (_, val) in &query_params {
            if val.is_string() {
                params_vec.push(rusqlite::types::Value::Text(val.as_str().unwrap().to_string()));
            } else if val.is_number() {
                if val.is_f64() {
                    params_vec.push(rusqlite::types::Value::Real(val.as_f64().unwrap()));
                } else if val.is_i64() {
                    params_vec.push(rusqlite::types::Value::Integer(val.as_i64().unwrap()));
                }
            }
        }
        
        let mut stmt = conn.prepare(&sql_query)
            .map_err(|e| e.to_string())?;

        let documents_str: Vec<String> = stmt.query_map(
            rusqlite::params_from_iter(params_vec),
            |row| row.get(0)
        )
        .map_err(|e| e.to_string())?
        .filter_map(std::result::Result::ok)
        .collect();

        let documents: Vec<Value> = documents_str.into_iter()
            .filter_map(|s| from_str(&s).ok())
            .collect();
        Ok(documents)
    }
}

#[tauri::command]
pub fn nedb_insert(app_handle: AppHandle, collection: String, mut doc: Value) -> Result<Value, String> {
    let conn = init_db(&app_handle, &collection).map_err(|e| e.to_string())?;

    let id = doc["_id"].as_str().map_or_else(|| Uuid::new_v4().to_string(), |s| s.to_string());
    doc["_id"] = Value::String(id.clone());

    let created_at = doc["createdAt"].as_str().map_or_else(|| Utc::now().to_rfc3339(), |s| s.to_string());
    doc["createdAt"] = Value::String(created_at.clone());

    let doc_str = to_string(&doc).map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO documents (_id, created_at, data) VALUES (?1, ?2, ?3)",
        params![id, created_at, doc_str],
    ).map_err(|e| e.to_string())?;

    Ok(doc)
}

#[tauri::command]
pub fn nedb_update(app_handle: AppHandle, collection: String, query: Value, update: Value, _options: Value) -> Result<u64, String> {
    let conn = init_db(&app_handle, &collection).map_err(|e| e.to_string())?;

    // For simplicity, we'll only support updating by _id for now.
    // A more robust solution would involve parsing the query and update objects more thoroughly.
    let query_id = query["_id"].as_str().ok_or("Update query must contain an _id field")?;

    let mut stmt = conn.prepare("SELECT data FROM documents WHERE _id = ?1")
        .map_err(|e| e.to_string())?;

    let existing_doc_str: String = stmt.query_row(params![query_id], |row| row.get(0))
        .map_err(|e| format!("Document not found or database error: {}", e.to_string()))?;

    let mut existing_doc: Map<String, Value> = from_str(&existing_doc_str)
        .map_err(|e| e.to_string())?;

    let update_map = update.as_object().ok_or("Update must be an object")?;

    // Apply updates. For simplicity, this assumes direct field replacement.
    // Nedb's update has more operators ($set, $inc, etc.) that would need to be implemented.
    for (key, value) in update_map {
        existing_doc.insert(key.clone(), value.clone());
    }

    let updated_doc_str = to_string(&Value::Object(existing_doc))
        .map_err(|e| e.to_string())?;

    let num_replaced = conn.execute(
        "UPDATE documents SET data = ?1 WHERE _id = ?2",
        params![updated_doc_str, query_id],
    ).map_err(|e| e.to_string())?;

    Ok(num_replaced as u64)
}

#[tauri::command]
pub fn nedb_remove(app_handle: AppHandle, collection: String, query: Value, _options: Value) -> Result<u64, String> {
    let conn = init_db(&app_handle, &collection).map_err(|e| e.to_string())?;

    // For simplicity, we'll only support removing by _id for now.
    let query_id = query["_id"].as_str().ok_or("Remove query must contain an _id field")?;

    let num_removed = conn.execute(
        "DELETE FROM documents WHERE _id = ?1",
        params![query_id],
    ).map_err(|e| e.to_string())?;

    Ok(num_removed as u64)
}

#[tauri::command]
pub fn nedb_clear_collection(app_handle: AppHandle, collection: String) -> Result<u64, String> {
    let conn = init_db(&app_handle, &collection).map_err(|e| e.to_string())?;

    let num_removed = conn.execute(
        "DELETE FROM documents",
        [],
    ).map_err(|e| e.to_string())?;

    Ok(num_removed as u64)
}

#[tauri::command]
pub fn nedb_bulk_insert(app_handle: AppHandle, collection: String, docs: Vec<Value>) -> Result<Vec<Value>, String> {
    let mut conn = init_db(&app_handle, &collection).map_err(|e| e.to_string())?;
    let tx = conn.transaction().map_err(|e| e.to_string())?;

    let mut inserted_docs = Vec::new();

    for mut doc in docs {
        let id = doc["_id"].as_str().map_or_else(|| Uuid::new_v4().to_string(), |s| s.to_string());
        doc["_id"] = Value::String(id.clone());

        let created_at = doc["createdAt"].as_str().map_or_else(|| Utc::now().to_rfc3339(), |s| s.to_string());
        doc["createdAt"] = Value::String(created_at.clone());

        let doc_str = to_string(&doc).map_err(|e| e.to_string())?;

        tx.execute(
            "INSERT INTO documents (_id, created_at, data) VALUES (?1, ?2, ?3)",
            params![id, created_at, doc_str],
        ).map_err(|e| e.to_string())?;
        inserted_docs.push(doc);
    }

    tx.commit().map_err(|e| e.to_string())?;
    Ok(inserted_docs)
}

#[tauri::command]
pub fn theme_set(app_handle: AppHandle, theme: String) -> Result<(), String> {
    let app_data_dir = app_handle.path().app_data_dir().expect("Failed to get app data dir");
    if !app_data_dir.exists() {
        fs::create_dir_all(&app_data_dir).expect("Failed to create app data directory");
    }
    let theme_path = app_data_dir.join("theme.json");
    fs::write(&theme_path, to_string(&theme).map_err(|e| e.to_string())?)
        .map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn theme_get(app_handle: AppHandle) -> Result<Option<String>, String> {
    let app_data_dir = app_handle.path().app_data_dir().expect("Failed to get app data dir");
    let theme_path = app_data_dir.join("theme.json");

    if theme_path.exists() {
        let theme_str = fs::read_to_string(&theme_path).map_err(|e| e.to_string())?;
        let theme: String = from_str(&theme_str).map_err(|e| e.to_string())?;
        Ok(Some(theme))
    } else {
        Ok(None)
    }
}