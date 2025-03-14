package org.lamisplus.modules.hiv.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import lombok.ToString;
import org.lamisplus.modules.base.security.SecurityUtils;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor(force = true)
@Table(name = "base_application_flag_config")
public class PatientFlag {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY )
    private Long id;

    @Column(name = "grace_period")
    private Integer gracePeriod;

    @Column(name = "surpression_value")
    private Integer surpressionValue;

//    @Column(name = "message")
//    private String message;

//    @Column(name = "api")
//    private String api;

    @Column(name = "facility_id")
    @JsonIgnore
    @ToString.Exclude
    private Long facilityId;

    @Column(name = "uuid")
    private String uuid;

    @Basic
    @Column(name = "archived")
    @NonNull
    private Integer archived = 0;

    @Column(name = "created_by", nullable = false, updatable = false)
    @JsonIgnore
    @ToString.Exclude
    @CreatedBy
    private String createdBy = SecurityUtils.getCurrentUserLogin().orElse(null);

    @Column(name = "date_created", nullable = false, updatable = false)
    @JsonIgnore
    @ToString.Exclude
    @CreatedDate
    private LocalDateTime dateCreated = LocalDateTime.now();

    @Column(name = "modified_by")
    @JsonIgnore
    @ToString.Exclude
    @LastModifiedBy
    private String modifiedBy = SecurityUtils.getCurrentUserLogin().orElse(null);

    @Column(name = "date_modified")
    @JsonIgnore
    @ToString.Exclude
    @LastModifiedDate
    private LocalDateTime dateModified = LocalDateTime.now();



}
