import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {ContentService} from '../../services/content.service';

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.sass']
})
export class GuideComponent {

  id: number;
  currentPart = {name: '', content: [] = []};
  readonly guide;

  constructor(
    private router: Router,
    private currentRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private data: ContentService
  ) {
    this.currentRoute.params.subscribe(param => this.id = param.id);
    this.guide = this.data.guides.find(guide => guide.id === +this.id);
    if (this.guide === undefined) {
      this.router.navigate(['/']);
    }
  }

  fillModalWindow(part) {
    this.currentPart.name = part.name;
    this.currentPart.content = [];
    const parsedContent = part.content.split('^');
    for (const line of parsedContent) {
      if (/[0-9]+\.(?:jpg|png|JPG|PNG)$/gi.test(line)) { // Image
        const link = `./assets/guides/${this.id}/img/${line}`;
        this.currentPart.content.push({data: link, code: 'img'});
      } else if (/https?:\/\/(www\.)?(\w+\.)+(\w+)(\/(\w+|\?*|=*|\.)+)*/gi.test(line)) { // Video
        this.currentPart.content.push({data: line, code: 'video'});
      } else if (/parts\.zip/gi.test(line)) { // .zip file
        const link = `./assets/guides/${this.id}/parts.zip`;
        this.currentPart.content.push({data: link, code: 'parts'});
      } else if (line.length > 0) { // Text
        this.currentPart.content.push({data: line, code: 'text'});
      }
    }
  }

  getImgId(data: string): number {
    return +data.match(/[0-9]+/g)[1];
  }
}