import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { Location } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-file-viewer',
  standalone: true,
  imports: [CommonModule, PdfViewerModule, HttpClientModule],
  templateUrl: './file-viewer.component.html',
  styleUrls: ['./file-viewer.component.css']
})
export class FileViewerComponent implements OnInit {
  categoryName = '';
  fileName = '';
  pdfSrc = '';
  isPdf = false;
  isExcel = false;
  isDocx = false;
  isTxt = false;
  
  excelData: any[][] = [];
  docxHtml: string | null = null;
  txtContent: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private location: Location,
    private meta: Meta,
    private title: Title
  ) {}

  goBack(): void {
    this.location.back();
  }

  ngOnInit(): void {
    this.title.setTitle(`${this.fileName} | File Viewer | Data Catalogue`);
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({
       name: 'description',
       content: `Viewing ${this.fileName} in the ${this.categoryName} category.`
   });
   this.meta.updateTag({ name: 'keywords', content: 'file viewer, data catalogue, document viewer, PDF viewer, Excel viewer, CSV viewer, DOCX viewer, text file viewer, file preview, online document viewer, file display, digital documents, spreadsheet viewer, text document reader, file content viewer, data category files, view files online, upload file viewer, data catalogue files' });

    this.categoryName = this.route.snapshot.paramMap.get('category') || '';
    this.fileName = this.route.snapshot.paramMap.get('filename') || '';
    const lowerFileName = this.fileName.toLowerCase();

    const baseUrl = `http://localhost:8080/uploads/${this.categoryName}/${this.fileName}`;

    if (lowerFileName.endsWith('.pdf')) {
      this.isPdf = true;
      this.pdfSrc = baseUrl;
    } else if (
      lowerFileName.endsWith('.xlsx') ||
      lowerFileName.endsWith('.xls') ||
      lowerFileName.endsWith('.csv')
    ) {
      this.isExcel = true;
      this.loadExcelFile(baseUrl, lowerFileName);
    } else if (lowerFileName.endsWith('.docx')) {
      this.isDocx = true;
      this.loadDocxFile(`http://localhost:8080/api/docx/${this.categoryName}/${this.fileName}`);
    } else if (lowerFileName.endsWith('.txt')) {
      this.isTxt = true;
      this.loadTxtFile(baseUrl);
    }
  }

  loadExcelFile(url: string, fileName: string) {
    if (fileName.endsWith('.csv')) {
      fetch(url)
        .then(res => res.text())
        .then(data => {
          const workbook = XLSX.read(data, { type: 'string' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          this.excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        })
        .catch(err => {
          console.error('Error loading CSV file:', err);
        });
    } else {
      fetch(url)
        .then(res => res.arrayBuffer())
        .then(data => {
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          this.excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        })
        .catch(err => {
          console.error('Error loading Excel file:', err);
        });
    }
  }

  loadDocxFile(url: string) {
    this.http.get(url, { responseType: 'text' }).subscribe({
      next: html => this.docxHtml = html,
      error: err => {
        console.error('Error loading DOCX content', err);
        this.docxHtml = '<p>Error loading document content.</p>';
      }
    });
  }

  loadTxtFile(url: string) {
    this.http.get(url, { responseType: 'text' }).subscribe({
      next: content => this.txtContent = content,
      error: err => {
        console.error('Error loading TXT file:', err);
        this.txtContent = 'Error loading TXT file.';
      }
    });
  }
}
