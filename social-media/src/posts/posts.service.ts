import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { randomUUID } from 'crypto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PostsService {
  private posts: Post[] = []

  constructor(private userService: UsersService) { }

  create(createPostDto: CreatePostDto) {
    try {
      this.userService.findOne(createPostDto.user)
    } catch {
      throw new BadRequestException("Invalid user id")
    }

    const post = new Post()
    post.id = randomUUID()
    post.content = createPostDto.content
    post.user = createPostDto.user
    post.timestamp = new Date()

    this.posts.push(post)
    return post
  }

  findAll() {
    return this.posts;
  }

  findOne(id: string) {
    const post = this.posts.find(post => post.id === id);
    if (!post) {
      throw new NotFoundException("Post not found")
    }
    try {
      const user = this.userService.findOne(post.user)
      return { ...post, user }
    } catch {
      return post
    }
  }

  update(id: string, updatePostDto: UpdatePostDto) {
    const index = this.posts.findIndex(post => post.id === id)
    if (index === -1) {
      throw new NotFoundException("Post not found")
    }
    if (updatePostDto.user !== this.posts[index].user) {
      throw new BadRequestException("User not authorized")
    }
    const newPost = { ...this.posts[index] }
    updatePostDto.content && (newPost.content = updatePostDto.content)
    return newPost
  }

  remove(id: string) {
    const index = this.posts.findIndex(post => post.id === id)
    if (index === -1) {
      throw new NotFoundException("Post not found")
    }
    return this.posts.splice(index)[0]
  }
}
