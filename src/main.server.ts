// src/main.server.ts

import 'zone.js/node';
import express from 'express';
import { join } from 'path';
import { readFileSync, existsSync } from 'fs';
import { renderApplication } from '@angular/platform-server';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

function createServer(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/project1/browser');
  const indexHtmlPath = join(distFolder, existsSync(join(distFolder, 'index.original.html')) 
    ? 'index.original.html' 
    : 'index.html');
  const indexHtml = readFileSync(indexHtmlPath, 'utf8');

  server.get('*.*', express.static(distFolder, {
    maxAge: '1y',
  }));

  server.get('*', async (req, res) => {
    try {
      const html = await renderApplication(
        () => bootstrapApplication(AppComponent, appConfig),
        {
          document: indexHtml,
          url: req.url,
        }
      );
      res.send(html);
    } catch (err) {
      console.error('❌ Error in SSR rendering:', err);
      res.status(500).send('Internal Server Error');
    }
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4200;
  const app = createServer();
  console.log(' Starting SSR server...');
  app.listen(port, () => {
    console.log(` SSR server running at http://localhost:${port}`);
  });
}

run();
