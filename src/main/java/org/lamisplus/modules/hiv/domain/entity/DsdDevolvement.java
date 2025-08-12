package org.lamisplus.modules.hiv.domain.entity;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.*;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.ResultCheckStyle;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.Where;
import org.lamisplus.modules.patient.domain.entity.Person;
import org.springframework.data.domain.Persistable;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDate;

@Entity
@Table(name="dsd_devolvement")
@Builder(toBuilder = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class DsdDevolvement extends HivAuditEntity implements Persistable<Long>, Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @JoinColumn(name = "person_uuid", referencedColumnName = "uuid")
    @ManyToOne
    private Person person;

    @Column(name = "viral_load_test_result")
    private String viralLoadTestResult;

    @Column(name = "viral_load_test_result_date")
    private LocalDate viralLoadTestResultDate;

    @Column(name = "dsd_eligible")
    private String dsdEligible;

    @Column(name = "dsd_accept")
    private String dsdAccept;

    @Column(name = "score")
    private int score;

    @Column(name="client_return_to_site")
    private String clientReturnToSite;

    @Column(name="date_return_to_site")
    private LocalDate dateReturnToSite;

    @Type(type = "jsonb-node")
    @Column(columnDefinition = "jsonb")
    private JsonNode serviceProvided;

    @Column(name = "dsd_model")
    private  String dsdModel;

    @Column(name = "dsd_type")
    private  String dsdType;

    @Column(name = "comment")
    private  String comment;

    @Column(name = "completed_by")
    private  String completedBy;

    @Column(name = "designation")
    private  String designation;

    @Column(name = "date_devolved")
    private LocalDate dateDevolved;

    @Column(nullable = false, unique = true, updatable = false)
    private String uuid;

    @Basic
    @Column(name = "archived")
    private int archived;

    @Basic
    @Column(name="outlet_name")
    private String outletName;

    @Type(type = "jsonb-node")
    @Column(columnDefinition = "jsonb")
    private JsonNode dsdEligibilityAssessment;

    @Basic
    @Column(name = "source")
    private String source;

    @Basic
    @Column(name = "longitude")
    private String longitude;

    @Basic
    @Column(name = "latitude")
    private  String latitude;

    @Override
    public boolean isNew() {
        return id == null;
    }      
    
}
