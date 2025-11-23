package com.meti.roombooking.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(
        name = "rooms",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "roomNumber")
        }
)
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(nullable = false)
    private String roomNumber;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false)
    private RoomType type;

    @Min(1)
    @Column(nullable = false)
    private int capacity;

    @NotNull
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerNight;

    @Enumerated(EnumType.STRING)
    @NotNull
    @Column(nullable = false)
    private RoomStatus status;

    @Column(length = 1000)
    private String description;
}
