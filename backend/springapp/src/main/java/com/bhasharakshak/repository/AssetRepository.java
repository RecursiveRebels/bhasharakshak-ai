package com.bhasharakshak.repository;

import com.bhasharakshak.model.LanguageAsset;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetRepository extends MongoRepository<LanguageAsset, String> {

    List<LanguageAsset> findByStatus(String status);

    List<LanguageAsset> findByLanguageNameContainingIgnoreCase(String languageName);

    List<LanguageAsset> findByUserIdAndIsPrivate(String userId, boolean isPrivate);
}
