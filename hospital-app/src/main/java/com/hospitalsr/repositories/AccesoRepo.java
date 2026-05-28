package com.hospitalsr.repositories;

import com.hospitalsr.entities.Acceso;
import com.hospitalsr.entities.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AccesoRepo extends JpaRepository<Acceso, Long> {
    
    List<Acceso> findByEstado(String estado);
    
    List<Acceso> findByFecha(LocalDate fecha);
    
    Optional<Acceso> findByEstudianteAndEstado(Estudiante estudiante, String estado);
    
    @Query("SELECT COUNT(a) FROM Acceso a WHERE a.estado = 'DENTRO'")
    long countEstudiantesDentro();
    
    @Query("SELECT a FROM Acceso a WHERE a.estado = 'DENTRO' ORDER BY a.horaIngreso DESC")
    List<Acceso> findEstudiantesDentro();
}