package org.lamisplus.modules.hiv.domain.entity;

import lombok.*;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.Persistable;

import javax.persistence.*;
import java.io.Serializable;
import java.security.Timestamp;
import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name="dsd_outlet")
@Builder(toBuilder = true)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class DSDOutlet implements Serializable, Comparable<DSDOutlet>, Persistable<Long> {

    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    private Long id;

    @Basic
    @Column(name = "state")
    private String state;
    @Basic
    @Column(name = "lga")
    private String lga;
    @Basic
    @Column(name = "hub_name")
    private String hubName;

    @Basic
    @Column(name = "spoke_name")
    private String spokeName;

    @Basic
    @Column(name = "hub_datim_uid")
    private String  hubDatimUid;

    @Basic
    @Column(name = "dsd_type")
    private String dsdType;

    @Basic
    @Column(name = "code")
    private String code;

    @Basic
    @Column(name = "archived")
    private Integer archived ;

    @Basic
    @Column(name = "last_modified_date", insertable = false, updatable = false)
    private Timestamp lastModifiedDate;

    @Basic
    @Column(name = "last_modified_by", insertable = false, updatable = false)
    private String lastModifiedBy;

    @Basic
    @Column(name = "created_by", insertable = false, updatable = false)
    private String  createdBy;

    @Basic
    @Column(name = "created_date", insertable = false, updatable = false)
    private Timestamp createdDate;

    @Basic
    @Column(name="active")
    private Boolean active;

    @Override
    public boolean isNew() {
        return id == null;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof DSDOutlet)) return false;
        DSDOutlet dsdOutlet = (DSDOutlet) o;
        return Objects.equals(getId(), dsdOutlet.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }

    @Override
    public int compareTo(@NotNull DSDOutlet o) {
        return 0;
    }
}
