package com.vti.AuthService.entity;

import java.io.Serializable;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "Position", catalog = "TestingSystem")
@NoArgsConstructor
@Getter
@Setter
public class Position implements Serializable {
    private static final long serialVersionUID = 1L;

    public enum PositionName {
        Dev, Test, Scrum_Master, PM
    }

    @Column(name = "PositionID")
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private short id;

    @Column(name = "PositionName", nullable = false, unique = true)
    @Enumerated(EnumType.STRING)
    private PositionName name;

    @JsonIgnore
    @OneToMany(mappedBy = "position", fetch = FetchType.LAZY)
    private List<Account> accounts;
}
