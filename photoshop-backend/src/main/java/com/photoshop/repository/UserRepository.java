package com.photoshop.repository;

import com.photoshop.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);

    @Query("SELECT COUNT(DISTINCT u.id) FROM User u JOIN u.roles r WHERE r = 'ROLE_ADMIN'")
    long countUsersWithAdminRole();
}
