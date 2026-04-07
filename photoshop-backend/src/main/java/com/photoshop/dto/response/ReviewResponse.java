package com.photoshop.dto.response;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private Long userId;
    private String userFullName;
    private String userProfileImage;
    private Long serviceId;
    private String serviceName;
    private Long equipmentId;
    private String equipmentName;
    private Integer rating;
    private String comment;
    private boolean approved;
    private String adminReply;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
