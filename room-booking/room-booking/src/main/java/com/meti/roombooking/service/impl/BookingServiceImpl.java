package com.meti.roombooking.service.impl;

import com.meti.roombooking.dto.booking.BookingRequest;
import com.meti.roombooking.dto.booking.BookingResponse;
import com.meti.roombooking.entity.*;
import com.meti.roombooking.repository.BookingRepository;
import com.meti.roombooking.repository.RoomRepository;
import com.meti.roombooking.repository.UserRepository;
import com.meti.roombooking.service.BookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;

    @Override
    public BookingResponse createBooking(BookingRequest bookingRequest) {
        //Validate that room exists
        Room room = roomRepository.findById(bookingRequest.getRoomId())
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));

        User user =  userRepository.findById(bookingRequest.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if(!bookingRequest.getCheckIn().isBefore(bookingRequest.getCheckOut())) {
            throw new IllegalArgumentException("Check in date must be before check out date");
        }
        List<Booking> overlaps =
                bookingRepository.findByRoomAndStatusInAndCheckOutGreaterThanAndCheckInLessThan(
                        room,
                        List.of(BookingStatus.PENDING, BookingStatus.CONFIRMED),
                        bookingRequest.getCheckIn(),
                        bookingRequest.getCheckOut()
                );
        if(!overlaps.isEmpty()) {
            throw new IllegalArgumentException("Room already booked for this date range");
        }

        long nights = ChronoUnit.DAYS.between(bookingRequest.getCheckIn(), bookingRequest.getCheckOut());
        BigDecimal total = room.getPricePerNight().multiply(BigDecimal.valueOf(nights));

        //Map the DTO to Entity
        Booking booking = new Booking();
        booking.setRoom(room);
        booking.setUser(user);
        booking.setCheckIn(bookingRequest.getCheckIn());
        booking.setCheckOut(bookingRequest.getCheckOut());
        booking.setStatus(BookingStatus.PENDING);
        booking.setTotalPrice(total);

        Booking saved = bookingRepository.save(booking);

        return mapToResponse(saved);


    }
    @Override
    public BookingResponse getBookingById(Long id){
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
        return mapToResponse(booking);
    }
    @Override
    public List<BookingResponse> getBookingsForUser(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return bookingRepository.findByUser(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponse> getAllBookings(){
        return bookingRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponse> getBookingByStatus(BookingStatus status){
        return bookingRepository.findByStatus(status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    @Override
    public BookingResponse cancelBooking(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        booking.setStatus(BookingStatus.CANCELLED);
        Booking updated = bookingRepository.save(booking);

        return mapToResponse(updated);
    }

    @Override
    public BookingResponse updateStatus(Long bookingId, BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        booking.setStatus(status);
        Booking updated = bookingRepository.save(booking);

        return mapToResponse(updated);
    }

    private BookingResponse mapToResponse(Booking booking) {
        return BookingResponse.builder()
                .id(booking.getId())
                .userId(booking.getUser().getId())
                .userFullName(booking.getUser().getFullName())
                .roomId(booking.getRoom().getId())
                .roomNumber(booking.getRoom().getRoomNumber())
                .checkIn(booking.getCheckIn())
                .checkOut(booking.getCheckOut())
                .status(booking.getStatus())
                .totalPrice(booking.getTotalPrice())
                .createdAt(booking.getCreatedAt())
                .build();
    }

}

