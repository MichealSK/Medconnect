package com.medconnect.backend.forum

import com.medconnect.backend.forum.model.*
import com.medconnect.backend.forum.dto.*
import com.medconnect.backend.shared.extension.currentUser
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/forum")
class ForumController(private val forumService: ForumService) {

    @GetMapping("/posts")
    fun getPosts(
        @RequestParam category: ForumCategory?,
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int,
        @RequestParam(required = false) search: String?,
    ) = ResponseEntity.ok(
        forumService.getPosts(
            category = category,
            search = search,
            pageable = PageRequest.of(page, size, Sort.by("createdAt").descending()),
            currentUserId = runCatching { currentUser().id }.getOrNull()
        )
    )

    @PostMapping("/posts")
    fun createPost(
        @RequestBody request: ForumPostRequest,
    ) = ResponseEntity.status(HttpStatus.CREATED)
        .body(forumService.createPost(request, currentUser().id!!))

    @GetMapping("/posts/{id}")
    fun getPostDetail(
        @PathVariable id: UUID,
    ) = ResponseEntity.ok(
        forumService.getPostDetail(id, runCatching { currentUser().id }.getOrNull())
    )

    @PostMapping("/posts/{id}/like")
    fun togglePostLike(
        @PathVariable id: UUID,
    ) = ResponseEntity.ok(forumService.togglePostLike(id, currentUser().id!!))

    @PostMapping("/posts/{id}/comments")
    fun addComment(
        @PathVariable id: UUID,
        @RequestBody request: ForumCommentRequest,
    ) = ResponseEntity.status(HttpStatus.CREATED)
        .body(forumService.addComment(id, request, currentUser().id!!))

    @PostMapping("/comments/{id}/like")
    fun toggleCommentLike(
        @PathVariable id: UUID,
    ) = ResponseEntity.ok(forumService.toggleCommentLike(id, currentUser().id!!))

    @DeleteMapping("/posts/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deletePost(
        @PathVariable id: UUID,
    ) = forumService.deletePost(id, currentUser().id!!)

    @DeleteMapping("/comments/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteComment(
        @PathVariable id: UUID,
    ) = forumService.deleteComment(id, currentUser().id!!)

    @GetMapping("/activity/my-posts")
    fun getMyPosts() = ResponseEntity.ok(forumService.getMyPosts(currentUser().id!!))

    @GetMapping("/activity/commented")
    fun getCommentedPosts() = ResponseEntity.ok(forumService.getCommentedPosts(currentUser().id!!))

    @GetMapping("/activity/liked")
    fun getLikedPosts() = ResponseEntity.ok(forumService.getLikedPosts(currentUser().id!!))
}