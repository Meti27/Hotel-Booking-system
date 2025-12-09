package com.meti.roombooking.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "bookings",
        indexes = {
                @Index(columnList = "checkIn"),
                @Index(columnList = "checkOut")
        }
)
public class Booking implements Comparable<Booking> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //Create many-to-one relation booking-user
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    //create many-to-one relation booking-room
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @NotNull
    @Future
    @Column(nullable = false)
    private LocalDate checkIn;

    @NotNull
    @Future
    @Column(nullable = false)
    private LocalDate checkOut;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false)
    private BookingStatus status;

    //Snapshot of total price at the time of booking was done
    @NotNull
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal totalPrice;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if(this.status == null){
            this.status = BookingStatus.PENDING;
        }
    }

    /**
     * Compares bookings primarily by check-in date (earliest first),
     * then by creation date, and finally by ID for consistency.
     * This allows sorting bookings chronologically.
     */
    @Override
    public int compareTo(Booking other) {
        if (other == null) {
            return 1;
        }

        // Primary comparison: by check-in date
        int checkInComparison = this.checkIn.compareTo(other.checkIn);
        if (checkInComparison != 0) {
            return checkInComparison;
        }

        // Secondary comparison: by creation date
        int createdAtComparison = this.createdAt.compareTo(other.createdAt);
        if (createdAtComparison != 0) {
            return createdAtComparison;
        }

        // Tertiary comparison: by ID for consistency
        return this.id.compareTo(other.id);
    }

    /**
     * Alternative: Compare by total price (highest to lowest)
     * Uncomment this and comment out the method above if you want to sort by price
     */
    /*
    @Override
    public int compareTo(Booking other) {
        if (other == null) {
            return 1;
        }
        // Negative for descending order (highest price first)
        return other.totalPrice.compareTo(this.totalPrice);
    }
    */
}