package com.meti.roombooking.dto.booking;

import com.meti.roombooking.entity.BookingStatus;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class BookingResponse {
    private Long id;

    private Long userId;
    private String userFullName;

    private Long roomId;
    private String roomNumber;

    private LocalDate checkIn;
    private LocalDate checkOut;

    private BookingStatus status;

    private BigDecimal totalPrice;

    private LocalDateTime createdAt;
}
