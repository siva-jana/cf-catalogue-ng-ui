import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { UserAuthService } from '../user-auth.service';
import { User } from '../user/user';
import { LoginComponent } from '../login/login.component';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, MatDialogModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user!: User | undefined;
  selectedFile: File | null = null;
  data: any[] = [];

  constructor(
    public userAuthService: UserAuthService,
    private router: Router,
    private dialog: MatDialog,
    private meta: Meta,
    private title: Title,

  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.userAuthService.getUser().then(({ data }) => {
        this.user = data;
        this.title.setTitle('Dashboard | Data Catalouge');
        this.meta.updateTag({ name: 'description', content: 'User dashboard with file management and uploads.' });
        this.meta.updateTag({ name: 'robots', content: 'index, follow' });
        this.meta.updateTag({ name: 'keywords', content: 'datasets, data catalogue, data catalog, file management, file uploads, user dashboard, data dashboard, category filters, data categories, agriculture data, animal husbandry data, art culture datasets, chemical data, IT data, finance datasets, public distribution data, urban development data, employment data, governance data, login required, user authentication,' });
      });
    }
  }

  logoutAction() { 
  this.userAuthService.logout().then(() => {
    localStorage.removeItem('token');
    this.user = undefined; // <-- clear user for UI
    this.router.navigateByUrl('/');
  }).catch(() => {
    localStorage.removeItem('token');
    this.user = undefined; // <-- ensure UI updates even on error
    this.router.navigateByUrl('/');
  });
}


  categories = [
    { name: 'Agriculture and Cooperation', icon: 'assets/icons/agri.png' ,selected: true},
    { name: 'Animal Husbandry and Fishing', icon: 'assets/icons/animal an husbandary.jpg' ,selected: true},
    { name: 'Art and Culture', icon: 'assets/icons/art.jpg',selected: true },
    { name: 'Chemicals & Fertilizers', icon: 'assets/icons/chemicals.jpg' ,selected: true},
    { name: 'Communications and Information Technology', icon: 'assets/icons/communication.jpg',selected: true },
    { name: 'Defence', icon: 'assets/icons/defence.jpg' ,selected: true},
    { name: 'Education and Training', icon: 'assets/icons/education.jpg',selected: true },
    { name: 'Employment & Labour', icon: 'assets/icons/emp.jpg',selected: true },
    { name: 'Finance, Banking & Insurance', icon: 'assets/icons/finance.jpg' ,selected: true},
    { name: 'Food & Public Distribution', icon: 'assets/icons/food.jpg',selected: true },
    { name: 'Forestry and Wildlife', icon: 'assets/icons/forest.jpg',selected: true },
    { name: 'Governance & Administration', icon: 'assets/icons/govt.jpg',selected: true },
    { name: 'Housing and Urban Development', icon: 'assets/icons/house.jpg' ,selected: true},
    { name: 'Information & Broadcasting', icon: 'assets/icons/inf.jpg' ,selected: true},
    { name: 'International Affairs', icon: 'assets/icons/international.jpg',selected: true },
    { name: 'Law & Justice', icon: 'assets/icons/law.jpg',selected: true },
    { name: 'IT', icon: 'assets/icons/it.jpg',selected: true },
    { name: 'Accounts', icon: 'assets/icons/acc.jpg',selected: true }
  ];

  onCategoryClick(categoryName: string) {
    const token = localStorage.getItem('token');
    if (!token) {
      const dialogRef = this.dialog.open(LoginComponent, {
        width: '400px',
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(success => {
        if (success) {
          const routeParam = categoryName.toLowerCase().replace(/\s+/g, '-');
          this.router.navigate(['/category', routeParam]);
        }
      });

      return;
    }

    const routeParam = categoryName.toLowerCase().replace(/\s+/g, '-');
    this.router.navigate(['/category', routeParam]);
  }

 resetFilters() {
  this.categories.forEach(category => category.selected = true);
}
  

  openLoginDialog(event: Event) {
  event.preventDefault(); // prevents link navigation
  const dialogRef = this.dialog.open(LoginComponent, {
    width: '400px',
    disableClose: true
  });

  dialogRef.afterClosed().subscribe(success => {
    if (success) {
      // After login, refresh the user
      this.userAuthService.getUser().then(({ data }) => {
        this.user = data;
      });
    }
  });
}



}
