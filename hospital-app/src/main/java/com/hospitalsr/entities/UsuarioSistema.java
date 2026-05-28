package com.hospitalsr.entities;

import jakarta.persistence.*;

@Entity
@Table(name = "usuario_sistema")
public class UsuarioSistema {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String nombre;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, length = 50)
    private String cedula;

    @Column(nullable = false, length = 50)
    private String rol; // ADMINISTRADOR, DIRECTOR, MEDICO, DOCENTE

    @Column(length = 150)
    private String correo;

    private Boolean activo = true;

    public UsuarioSistema() {}
    public UsuarioSistema(String nombre, String username, String password, String cedula, String rol) {
        this.nombre = nombre; this.username = username;
        this.password = password; this.cedula = cedula; this.rol = rol;
        this.activo = true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getCedula() { return cedula; }
    public void setCedula(String cedula) { this.cedula = cedula; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
}
