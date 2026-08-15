package com.nova.controller;

import com.nova.command.CommandInvoker;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

// Access already restricted to ROLE_ADMIN for all of /api/admin/** in SecurityConfig.
@RestController
@RequestMapping("/api/admin/command-history")
@RequiredArgsConstructor
public class AdminCommandHistoryController {

    private final CommandInvoker commandInvoker;

    @GetMapping
    public List<String> getHistory() {
        return commandInvoker.getHistory();
    }
}
