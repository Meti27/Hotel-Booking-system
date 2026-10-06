package com.example.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Controller
@RequestMapping("/search")
public class SearchController {

    @Autowired
    private SearchService searchService;

    // Handle GET requests to display the search form or results
    @GetMapping
    public String search(@RequestParam(value = "q", required = false) String query, Model model) {
        if (query != null && !query.isEmpty()) {
            List<Object> results = searchService.findResults(query);
            model.addAttribute("results", results);
        }
        return "search"; // Returns the search.html view
    }

    // Handle POST requests if using a form submission
    @PostMapping
    public String searchPost(@RequestParam("q") String query, Model model) {
        List<Object> results = searchService.findResults(query);
        model.addAttribute("results", results);
        return "search";
    }
}