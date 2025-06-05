import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';


@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule],
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.css']
})
export class CategoryPageComponent implements OnInit {
  categoryName = '';
  files: { name: string; url: string }[] = [];
  searchQuery = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private meta: Meta,
    private title: Title,

  ) {}

  ngOnInit(): void {
    this.categoryName = this.route.snapshot.paramMap.get('name') || '';
    this.title.setTitle(`${this.categoryName} | Categories | Data Catalogue`);
    this.meta.updateTag({ name: 'description', content: `Files and documents in the ${this.categoryName} category.` });
    this.meta.updateTag({ name: 'keywords', content: 'data catalogue, category files, file search, document repository, file filters, PDF files, Excel files, Word documents, text files, PowerPoint files, downloadable files, data categories, category documents, file management, search files, filtered files, file extensions, data catalogue search, file listing, data category page, digital documents, online data repository' });
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });

    const apiUrl = `http://localhost:8080/api/files/${this.categoryName}`;

    this.http.get<{ name: string; url: string }[]>(apiUrl).subscribe({
      next: (data) => this.files = data,
      error: () => console.error('Could not load files for category:', this.categoryName)
    });
  }

  get filteredFiles() {
  const query = this.searchQuery.trim().toLowerCase();

  // Determine selected file extensions based on filters
  const selectedExtensions: string[] = [];
  if (this.filters.pdf) selectedExtensions.push('.pdf');
  if (this.filters.excel) selectedExtensions.push('.xlsx', '.xls', '.csv');
  if (this.filters.word) selectedExtensions.push('.docx');
  if (this.filters.text) selectedExtensions.push('.txt');
  if (this.filters.pptx) selectedExtensions.push('.pptx');
  return this.files.filter(file => {
    const name = file.name.toLowerCase();

    const matchesSearch = name.includes(query);

    // If no filters selected, allow all types
    const matchesType =
      selectedExtensions.length === 0 ||
      selectedExtensions.some(ext => name.endsWith(ext));

    return matchesSearch && matchesType;
  });
}


  searchAndNavigate() {
    // Optional: Scroll to the result area
    document.querySelector('.file-list')?.scrollIntoView({ behavior: 'smooth' });
  }

  filters = {
  pdf: false,
  excel: false,
  word: false,
  text: false,
  pptx: false
};

resetFilters() {
  this.filters = { pdf: false, excel: false, word: false,text: false, pptx: false };
}
canView(fileName: string): boolean {
  const allowedExts = ['.pdf', '.docx', '.xlsx', '.xls', '.csv', '.txt'];
  const lowerName = fileName.toLowerCase();
  return allowedExts.some(ext => lowerName.endsWith(ext));
}

}
