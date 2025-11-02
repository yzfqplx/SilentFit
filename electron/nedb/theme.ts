import Datastore from 'nedb';
import { app } from 'electron';
import path from 'path';

const userDataPath = app.getPath('userData');

const db = new Datastore({
  filename: path.join(userDataPath, 'theme.db'),
  autoload: true,
});

export const getTheme = (): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    db.findOne({}, (err, doc: { theme: string } | null) => {
      if (err) {
        reject(err);
      } else {
        resolve(doc ? doc.theme : null);
      }
    });
  });
};

export const setTheme = (theme: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    db.update({}, { theme }, { upsert: true }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};
