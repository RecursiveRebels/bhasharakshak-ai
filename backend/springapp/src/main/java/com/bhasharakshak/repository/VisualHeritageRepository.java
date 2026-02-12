package com.bhasharakshak.repository;

import com.bhasharakshak.model.VisualHeritage;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VisualHeritageRepository extends MongoRepository<VisualHeritage, String> {
    List<VisualHeritage> findByStatus(String status);

    List<VisualHeritage> findByLanguage(String language);
}
