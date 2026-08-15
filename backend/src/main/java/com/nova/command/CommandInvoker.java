package com.nova.command;

import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.util.ArrayDeque;
import java.util.Collections;
import java.util.Deque;
import java.util.List;

/**
 * Invoker: controllers never call command.execute() directly, they go through
 * run() — which is the one place that would grow retry/undo/audit logic later
 * without touching every controller. In-memory, bounded, process-lifetime only —
 * a real audit trail belongs in the database, out of scope here.
 */
@Component
public class CommandInvoker {

    private static final int MAX_HISTORY = 50;
    private final Deque<String> history = new ArrayDeque<>();

    public synchronized <T> T run(String label, Command<T> command) {
        T result = command.execute();
        history.addFirst(OffsetDateTime.now() + " — " + label);
        while (history.size() > MAX_HISTORY) {
            history.removeLast();
        }
        return result;
    }

    public synchronized List<String> getHistory() {
        return Collections.unmodifiableList(List.copyOf(history));
    }
}
