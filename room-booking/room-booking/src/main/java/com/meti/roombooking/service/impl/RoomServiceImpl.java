package com.meti.roombooking.service.impl;

import com.meti.roombooking.dto.room.RoomRequest;
import com.meti.roombooking.dto.room.RoomResponse;
import com.meti.roombooking.entity.Room;
import com.meti.roombooking.entity.RoomStatus;
import com.meti.roombooking.entity.RoomType;
import com.meti.roombooking.repository.RoomRepository;
import com.meti.roombooking.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class RoomServiceImpl implements RoomService {

    private final RoomRepository roomRepository;

    @Override
    public RoomResponse createRoom(RoomRequest request) {
        Room room = new Room();
        room.setRoomNumber(request.getRoomNumber());
        room.setType(request.getType());
        room.setCapacity(request.getCapacity());
        room.setPricePerNight(request.getPricePerNight());
        room.setStatus(request.getStatus());
        room.setDescription(request.getDescription());

        Room saved = roomRepository.save(room);
        return mapToResponse(saved);
    }

    @Override
    public RoomResponse updateRoom(Long roomId, RoomRequest request) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));

        room.setRoomNumber(request.getRoomNumber());
        room.setType(request.getType());
        room.setCapacity(request.getCapacity());
        room.setPricePerNight(request.getPricePerNight());
        room.setStatus(request.getStatus());
        room.setDescription(request.getDescription());

        Room updated = roomRepository.save(room);
        return mapToResponse(updated);
    }

    @Override
    public void deleteRoom(Long roomId) {
        if (!roomRepository.existsById(roomId)) {
            throw new IllegalArgumentException("Room not found");
        }
        roomRepository.deleteById(roomId);
    }

    @Override
    @Transactional(readOnly = true)
    public RoomResponse getRoomById(Long roomId) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Room not found"));
        return mapToResponse(room);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomResponse> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomResponse> findAvailableRooms(
            LocalDate checkIn,
            LocalDate checkOut,
            Integer guests,
            RoomType type
    ) {
        if (checkIn == null || checkOut == null) {
            throw new IllegalArgumentException("checkIn and checkOut are required");
        }

        if (checkOut.isBefore(checkIn)) {
            throw new IllegalArgumentException("checkOut cannot be before checkIn");
        }

        List<Room> rooms = roomRepository.findAvailableRooms(checkIn, checkOut, guests, type);

        return rooms.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RoomResponse> findByStatus(RoomStatus status) {
        return roomRepository.findByStatus(status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private RoomResponse mapToResponse(Room room) {
        return RoomResponse.builder()
                .id(room.getId())
                .roomNumber(room.getRoomNumber())
                .type(room.getType())
                .capacity(room.getCapacity())
                .pricePerNight(room.getPricePerNight())
                .status(room.getStatus())
                .description(room.getDescription())
                .build();
    }

}
