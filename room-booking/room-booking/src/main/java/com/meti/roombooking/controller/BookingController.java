package com.meti.roombooking.controller;

import com.meti.roombooking.dto.booking.BookingRequest;
import com.meti.roombooking.dto.booking.BookingResponse;
import com.meti.roombooking.entity.BookingStatus;
import com.meti.roombooking.entity.RoomStatus;
import com.meti.roombooking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService bookingService;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(@Valid @RequestBody BookingRequest request){
        return ResponseEntity.ok(bookingService.createBooking(request));

    }
    @GetMapping("/{id}")
    public ResponseEntity<BookingResponse> getBookingById(@PathVariable Long id){
        return ResponseEntity.ok(bookingService.getBookingById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<BookingResponse>> getBookingForUser(@PathVariable Long userId){
        return ResponseEntity.ok(bookingService.getBookingsForUser(userId));
    }

    @GetMapping
    public ResponseEntity<List<BookingResponse>> getAllBooking(){
        return ResponseEntity.ok(bookingService.getAllBookings());
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


}
