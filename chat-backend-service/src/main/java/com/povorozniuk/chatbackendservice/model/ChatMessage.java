package com.povorozniuk.chatbackendservice.model;

import lombok.Data;

@Data
public class ChatMessage {

    private String data;
    private String senderId;
    private String senderName;
    private String chatId;
    private Integer messageId;

}
