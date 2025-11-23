package com.meti.roombooking.dto.room;


import com.meti.roombooking.entity.RoomStatus;
import com.meti.roombooking.entity.RoomType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class RoomResponse {
    private Long id;
    private String roomNumber;
    private RoomType type;
    private int capacity;
    private BigDecimal pricePerNight;
    private RoomStatus status;
    private String description;
}
