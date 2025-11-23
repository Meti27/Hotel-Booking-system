package com.meti.roombooking.service;

import com.meti.roombooking.dto.booking.BookingRequest;
import com.meti.roombooking.dto.booking.BookingResponse;
import com.meti.roombooking.entity.BookingStatus;

import java.util.List;

public interface BookingService {
    BookingResponse createBooking(BookingRequest request);

    BookingResponse getBookingById(Long id);

    List<BookingResponse> getBookingsForUser(Long id);

    List<BookingResponse> getAllBookings();

    List<BookingResponse> getBookingByStatus(BookingStatus status);

    BookingResponse cancelBooking(Long bookingId);

    //method for admin confirm/cancel
    BookingResponse updateStatus(Long bookingId, BookingStatus status);


}
