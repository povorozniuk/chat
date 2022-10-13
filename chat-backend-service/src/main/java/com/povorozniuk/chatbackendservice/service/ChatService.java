package com.povorozniuk.chatbackendservice.service;

import com.povorozniuk.chatbackendservice.model.ChatMessage;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class ChatService {

    @Autowired
    SimpMessagingTemplate messageTemplate;

    private final Map<String, LocalDateTime> chatList = new HashMap<>();
    private final Map<String, Integer> maxMessageId = new HashMap<>();
    private final char[] CHAT_ID_ALLOWED_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789".toCharArray();
    public String createNewChat(final ChatMessage message){
        String chatId =  RandomStringUtils.random(8, CHAT_ID_ALLOWED_CHARS);
        if (chatList.containsKey(chatId)){
            throw new IllegalStateException("Chat " + chatId + " already exists");
        }
        chatList.put(chatId, LocalDateTime.now(ZoneId.of("UTC")));
        log.info("{} {} created a new chat {}", message.getSenderName(), message.getSenderId(), chatId);
        maxMessageId.put(chatId, 1);
        return chatId;
    }

    public void processInputMessage(final ChatMessage message){
        maxMessageId.putIfAbsent(message.getChatId(), 1);
        int messageId = maxMessageId.get(message.getChatId());
        maxMessageId.put(message.getChatId(), messageId + 1);
//        log.info("{} obtained messageId {} in {}", message.getSenderName(), messageId, message.getChatId());
        message.setMessageId(messageId);
        messageTemplate.convertAndSend("/topic/" + message.getChatId(), message);
    }
}
