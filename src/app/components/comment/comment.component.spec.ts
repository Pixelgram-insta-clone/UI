import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentComponent } from './comment.component';
import {Comment} from '../../models/Comment';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CommentComponent', () => {
  let component: CommentComponent;
  let fixture: ComponentFixture<CommentComponent>;
  let comment: Comment = {
    id: 1,
    postId: 1,
    username: 'user1',
    body: 'This is a comment for the post: This is a description of a dog. It is a Shibu Inu with a very strong stance. Shibu Inus are very active animals.',
    createdOn: '2022-06-10'
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentComponent);
    component = fixture.componentInstance;
    component.comment = comment;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle comment', () => {
    expect(component.commentSlice).toBe(100);
    expect(component.moreButton).toBe('more');
    expect(component.ellipses).toBe('... ');
    component.toggleComment();
    expect(component.moreButton).toBe('less');
    expect(component.ellipses).toBe('');
    expect(component.commentSlice).toBe(comment.body.length);
  });

  it('should check else condition', () => {
    component.moreButton = 'less';
    component.toggleComment();
    expect(component.moreButton).toBe('more');
    expect(component.ellipses).toBe('... ');
    expect(component.commentSlice).toBe(100);
  });
});
