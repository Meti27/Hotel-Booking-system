package com.meti.roombooking.repository;

import com.meti.roombooking.entity.Room;
import com.meti.roombooking.entity.RoomStatus;
import com.meti.roombooking.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByStatus(RoomStatus status);

    List<Room> findByTypeAndStatus(RoomType type, RoomStatus status);
    @Query("""
        SELECT r
        FROM Room r
        WHERE (:guests IS NULL OR r.capacity >= :guests)
          AND (:type IS NULL OR r.type = :type)
          AND NOT EXISTS (
            SELECT 1
            FROM Booking b
            WHERE b.room = r
              AND b.checkIn < :checkOut
              AND b.checkOut > :checkIn
          )
        """)
    List<Room> findAvailableRooms(
            @Param("checkIn") LocalDate checkIn,
            @Param("checkOut") LocalDate checkOut,
            @Param("guests") Integer guests,
            @Param("type") RoomType type
    );
}
