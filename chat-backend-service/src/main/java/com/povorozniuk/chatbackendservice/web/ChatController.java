package com.povorozniuk.chatbackendservice.web;

import com.povorozniuk.chatbackendservice.model.ChatMessage;
import com.povorozniuk.chatbackendservice.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(value = "*")
@RestController
public class ChatController {

    private final ChatService chatService;

    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @MessageMapping("/message")
    public void getInputMessage(@RequestBody ChatMessage message){
        chatService.processInputMessage(message);
    }

    @PostMapping(path = "/createChat")
    public ResponseEntity<?> createChat (@RequestBody @Valid ChatMessage message){
        String chatId = chatService.createNewChat(message);
        Map<String, String> response = new HashMap<>();
        response.put("chatId", chatId);
        return ResponseEntity.ok(response);
    }


}
