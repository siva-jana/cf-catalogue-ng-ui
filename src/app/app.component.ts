import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  // note: should be styleUrls, plural
})
export class AppComponent implements OnInit {
  title = 'project1';

  constructor(private titleService: Title, private meta: Meta) {}

  ngOnInit() {
    this.titleService.setTitle('Data Catalogue ');
    this.meta.addTags([
      { name: 'description', content: 'you cand find the all datasets here regarding a company' },
      { name: 'keywords', content: 'excel,pdf,ppt,excel,datasets,records,files,findings' },
      { name: 'robots', content: 'index, follow' }
    ]);
  }
}
