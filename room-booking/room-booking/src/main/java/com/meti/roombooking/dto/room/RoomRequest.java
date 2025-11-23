package com.meti.roombooking.dto.room;

import com.meti.roombooking.entity.RoomStatus;
import com.meti.roombooking.entity.RoomType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
@Data
public class RoomRequest {

    @NotBlank
    private String roomNumber;

    @NotNull
    private RoomType type;

    @Min(1)
    private int capacity;

    @NotNull
    private BigDecimal pricePerNight;

    @NotNull
    private RoomStatus status;

    private String description;
}
