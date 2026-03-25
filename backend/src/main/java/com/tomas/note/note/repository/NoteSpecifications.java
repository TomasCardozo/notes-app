package com.tomas.note.note.repository;

import com.tomas.note.note.domain.Note;

import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;
import java.util.Set;

public class NoteSpecifications {

    public static Specification<Note> archivedEquals(Boolean archived) {
        return (root, query, criteriaBuilder) -> archived == null ? criteriaBuilder.conjunction() : criteriaBuilder.equal(root.get("archived"), archived);
    }

    public static Specification<Note> hasAnyCategoryIds(Set<Long> ids){
        return ((root, query, criteriaBuilder) -> {
            if(ids == null || ids.isEmpty()) return criteriaBuilder.conjunction();

            query.distinct(true);
            var join = root.join("categories", JoinType.INNER);
            return join.get("id").in(ids);
        });
    }

    public static Specification<Note> hasAllCategoryIds(Set<Long> ids){
        return (root, query, criteriaBuilder) -> {
            if(ids == null || ids.isEmpty()) return criteriaBuilder.conjunction();

            var join = root.join("categories", JoinType.INNER);
            query.groupBy(root.get("id"));
            query.having(criteriaBuilder.equal(criteriaBuilder.countDistinct(join.get("id")), (long) ids.size()));
            return join.get("id").in(ids);
        };
    }
}
