package com.meti.roombooking.service;

import com.meti.roombooking.dto.room.RoomRequest;
import com.meti.roombooking.dto.room.RoomResponse;
import com.meti.roombooking.entity.Room;
import com.meti.roombooking.entity.RoomStatus;
import com.meti.roombooking.entity.RoomType;

import java.time.LocalDate;
import java.util.List;

public interface RoomService {

    RoomResponse createRoom(RoomRequest request);
    RoomResponse updateRoom(Long roomId, RoomRequest request);

    void deleteRoom(Long roomId);

    RoomResponse getRoomById(Long roomId);

    List<RoomResponse> getAllRooms();

    List<RoomResponse> findAvailableRooms(
            LocalDate startDate,
            LocalDate endDate,
            Integer guests,
            RoomType type
    );
    List<RoomResponse> findByStatus(RoomStatus status);


}
