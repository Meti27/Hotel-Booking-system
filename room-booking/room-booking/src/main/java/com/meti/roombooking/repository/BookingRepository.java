package com.meti.roombooking.repository;

import com.meti.roombooking.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByRoom(Room room);

    List<Booking> findByUser(User user);

    List<Booking> findByStatus(BookingStatus status);

    //method to make sure the same room is not booked twice at the same time its busy
    List<Booking> findByRoomAndStatusInAndCheckOutGreaterThanAndCheckInLessThan(
            Room room,
            List<BookingStatus> statuses,
            LocalDate checkIn,
            LocalDate checkOut
    );

    List<Booking> findByUserId(Long userId);
}
