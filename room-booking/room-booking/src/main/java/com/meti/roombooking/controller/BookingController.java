package com.meti.roombooking.controller;

import com.meti.roombooking.dto.booking.BookingRequest;
import com.meti.roombooking.dto.booking.BookingResponse;
import com.meti.roombooking.entity.BookingStatus;
import com.meti.roombooking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingRequest request) {
        try {
            BookingResponse booking = bookingService.createBooking(request);
            log.info("Booking created successfully with ID: {}", booking.getId());
            return ResponseEntity.ok(booking);
        } catch (IllegalArgumentException e) {
            log.error("Invalid booking request: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid booking data: " + e.getMessage());
        } catch (RuntimeException e) {
            log.error("Room unavailable or conflict: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Booking conflict: " + e.getMessage());
        } catch (Exception e) {
            log.error("Error creating booking", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while creating the booking");
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        try {
            BookingResponse booking = bookingService.getBookingById(id);
            return ResponseEntity.ok(booking);
        } catch (RuntimeException e) {
            log.error("Booking not found with ID: {}", id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Booking not found with ID: " + id);
        } catch (Exception e) {
            log.error("Error retrieving booking with ID: {}", id, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving the booking");
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getBookingForUser(@PathVariable Long userId) {
        try {
            List<BookingResponse> bookings = bookingService.getBookingsForUser(userId);
            return ResponseEntity.ok(bookings);
        } catch (RuntimeException e) {
            log.error("User not found with ID: {}", userId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found with ID: " + userId);
        } catch (Exception e) {
            log.error("Error retrieving bookings for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving user bookings");
        }
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<BookingResponse>> getBookingByStatus(@PathVariable BookingStatus status){
        return ResponseEntity.ok(bookingService.getBookingByStatus(status));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(@PathVariable Long id){
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }
    @PostMapping("{id}/status")
    public ResponseEntity<BookingResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam BookingStatus status
    ){
        return ResponseEntity.ok(bookingService.updateStatus(id, status));
    }

    @GetMapping("/admin")
    public List<BookingResponse> getAllBookings() {
        return bookingService.getAllBookings();
    }


    @GetMapping("/sorted")
    public ResponseEntity<?> getBookingsSorted(
            @RequestParam(defaultValue = "checkIn") String sortBy,
            @RequestParam(defaultValue = "asc") String order) {
        try {
            List<BookingResponse> bookings = bookingService.getBookingsSorted(sortBy, order);
            return ResponseEntity.ok(bookings);
        } catch (IllegalArgumentException e) {
            log.error("Invalid sort parameter: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid sort parameter: " + e.getMessage());
        } catch (Exception e) {
            log.error("Error retrieving sorted bookings", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving sorted bookings");
        }
    }

    @GetMapping("/user/{userId}/sorted")
    public ResponseEntity<?> getUserBookingsSorted(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "checkIn") String sortBy,
            @RequestParam(defaultValue = "asc") String order) {
        try {
            List<BookingResponse> bookings = bookingService.getUserBookingsSorted(userId, sortBy, order);
            return ResponseEntity.ok(bookings);
        } catch (RuntimeException e) {
            log.error("User not found with ID: {}", userId);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found with ID: " + userId);
        } catch (Exception e) {
            log.error("Error retrieving sorted bookings for user: {}", userId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while retrieving user bookings");
        }
    }
}
