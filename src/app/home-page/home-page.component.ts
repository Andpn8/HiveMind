import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { IdeaService } from '../_services/idea.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommentService } from '../_services/comment.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  showPublishedMessage = false;
  ideas: any[] = [];
  currentPage = 1;
  pageSize = 10;
  newComment: string = '';
  loggedIn: boolean = false;
  errorMessage: string = '';
  filterType: 'controversial' | 'unpopular' | 'mainstream' = 'controversial';

  constructor(
    private route: ActivatedRoute,
    private ideaService: IdeaService,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private commentService: CommentService
  ) {}

  ngOnInit() {
    document.body.style.overflow = 'auto'; // Ripristina la barra di scorrimento

    // Controlla se il parametro di query "published" è presente e impostalo
    this.route.queryParams.subscribe(params => {
      this.showPublishedMessage = params['published'] === 'true';
      // Nascondi il messaggio dopo 3 secondi
      if (this.showPublishedMessage) {
        setTimeout(() => {
          this.showPublishedMessage = false;
        }, 3000);
      }
    });

    // Carica le idee all'inizializzazione del componente
    this.loadIdeas();

    // Verifica se l'utente è autenticato
    this.authService.isLoggedIn.subscribe((loggedIn: boolean) => {
      this.loggedIn = loggedIn;
    });
}

  loadIdeas(): void {
    this.ideaService.getAllIdeas().subscribe(
      (ideas) => {
        console.log('Ideas fetched from backend:', ideas);
        this.ideas = ideas.map((idea: { content: string }) => ({
          ...idea,
          content: this.sanitizer.bypassSecurityTrustHtml(idea.content),
          showComments: false,
          comments: []
        }));
      },
      (error) => {
        console.error('Error fetching ideas:', error);
      }
    );
  }

  loadFilteredIdeas(filterType: 'controversial' | 'unpopular' | 'mainstream'): void {
    this.filterType = filterType; 
    this.ideaService.getFilteredIdeas(filterType).subscribe(
      (ideas: any[]) => {
        this.ideas = ideas.map((idea: { content: string }) => ({
          ...idea,
          showComments: false,
          comments: []
        }));
        this.currentPage = 1; // Reimposta la pagina corrente a 1 dopo aver cambiato il set di idee
      },
      (error) => {
        console.error('Error fetching filtered ideas:', error);
      }
    );
  }

  get pagedIdeas(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.ideas.slice(startIndex, endIndex);
  }

  get pages(): number[] {
    const pageCount = Math.ceil(this.filteredIdeas.length / this.pageSize);
    return Array(pageCount).fill(0).map((_, index) => index + 1);
  }

  get filteredIdeas(): any[] {
    return this.ideas;
  }

  setCurrentPage(page: number): void {
    this.currentPage = page;
  }

  upvoteIdea(ideaId: number): void {
    this.ideaService.upvoteIdea(ideaId).subscribe(
      (updatedIdea) => {
        const index = this.ideas.findIndex(idea => idea.id === ideaId);
        if (index !== -1) {
          // Mantieni i commenti originali dell'idea
          updatedIdea.comments = this.ideas[index].comments;
          this.ideas[index] = updatedIdea;
        }
      },
      (error) => {
        this.errorMessage = "Hai già votato questa idea!";
        setTimeout(() => {
          this.errorMessage = '';
        }, 2000); // Nascondi il messaggio dopo 2 secondi
      }
    );
  }
  
  downvoteIdea(ideaId: number): void {
    this.ideaService.downvoteIdea(ideaId).subscribe(
      (updatedIdea) => {
        const index = this.ideas.findIndex(idea => idea.id === ideaId);
        if (index !== -1) {
          // Mantieni i commenti originali dell'idea
          updatedIdea.comments = this.ideas[index].comments;
          this.ideas[index] = updatedIdea;
        }
      },
      (error) => {
        this.errorMessage = "Hai già votato questa idea!";
        setTimeout(() => {
          this.errorMessage = '';
        }, 2000); // Nascondi il messaggio dopo 2 secondi
      }
    );
  }

  toggleComments(ideaId: number): void {
    const idea = this.ideas.find(i => i.id === ideaId);
    if (idea) {
      idea.showComments = !idea.showComments;
      if (idea.showComments && !idea.comments.length) {
        this.loadComments(ideaId);
      }
    }
  }

  loadComments(ideaId: number): void {
    this.commentService.getComments(ideaId).subscribe(
      (comments) => {
        const idea = this.ideas.find(i => i.id === ideaId);
        if (idea) {
          idea.comments = comments;
        }
      },
      (error) => {
        console.error('Error loading comments:', error);
      }
    );
  }

  addComment(ideaId: number): void {
    if (this.newComment.trim()) {
      this.commentService.addComment(ideaId, this.newComment).subscribe(
        (comment) => {
          const idea = this.ideas.find(i => i.id === ideaId);
          if (idea && idea.comments) {
            idea.comments.push(comment);
          }
          this.newComment = '';
        },
        (error) => {
          console.error('Error adding comment:', error);
        }
      );
    }
  }
}
