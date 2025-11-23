package com.meti.roombooking.controller;

import com.meti.roombooking.dto.room.RoomRequest;
import com.meti.roombooking.dto.room.RoomResponse;
import com.meti.roombooking.entity.Room;
import com.meti.roombooking.entity.RoomStatus;
import com.meti.roombooking.entity.RoomType;
import com.meti.roombooking.service.RoomService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class RoomController {
    private final RoomService roomService;

    //PUBLIC ENDPOINTS

    @GetMapping("/api/rooms")
    public ResponseEntity<List<RoomResponse>> getRooms()
    {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/api/rooms/{id}")
    public ResponseEntity<RoomResponse> getRoomById(@PathVariable Long id){
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @GetMapping("/api/rooms/available")
    public ResponseEntity<List<RoomResponse>> getAvailableRooms(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut,
            @RequestParam(required = false) Integer guests,
            @RequestParam(required = false) RoomType type
    ) {
        return ResponseEntity.ok(
                roomService.findAvailableRooms(checkIn, checkOut, guests, type)
        );
    }

    //ADMIN ENDPOINTS//TODO PROTECT VIA JWT /ROLES
    @PostMapping("/api/admin/rooms")
    public ResponseEntity<RoomResponse> createRoom(@Valid @RequestBody RoomRequest request) {
        System.out.println("DEBUG RoomRequest: " + request);
        return ResponseEntity.ok(roomService.createRoom(request));
    }

    @PutMapping("/api/admin/rooms/{id}")
    public ResponseEntity<RoomResponse> updateRoom(
            @PathVariable Long id,
            @Valid @RequestBody RoomRequest request
    ){
        return ResponseEntity.ok(roomService.updateRoom(id, request));
    }

    @DeleteMapping("/api/admin/rooms/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id){
        roomService.deleteRoom(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/admin/rooms/status/{status}")
    public ResponseEntity<List<RoomResponse>> getRoomsByStatus(@PathVariable RoomStatus status){
        return ResponseEntity.ok(roomService.findByStatus(status));
    }

}
