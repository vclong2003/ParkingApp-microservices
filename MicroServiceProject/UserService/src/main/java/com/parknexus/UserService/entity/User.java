package com.parknexus.UserService.entity;

import java.io.Serializable;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString
public class User implements Serializable {
    private Integer id;
    private String firstname;
    private String lastname;
}
