package org.lamisplus.modules.hiv.repositories;

import org.lamisplus.modules.hiv.domain.entity.Regimen;
import org.lamisplus.modules.hiv.domain.entity.RegimenType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RegimenRepository extends JpaRepository<Regimen, Long> {
    List<Regimen> getAllByRegimenTypeAndActiveIsTrue(RegimenType regimenType);

    Optional<Regimen> findByDescriptionAndActiveIsTrue(String description);
}
