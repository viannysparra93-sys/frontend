package com.hospitalsr.repositories;

import com.hospitalsr.entities.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EstudianteRepo extends JpaRepository<Estudiante, Long> {
    
    Optional<Estudiante> findByDocumento(String documento);
    
    List<Estudiante> findByActivoTrue();
    
    // Concuerda exactamente con el filtro de búsqueda por barra superior del MainController
    List<Estudiante> findByNombresContainingIgnoreCaseOrApellidosContainingIgnoreCase(String nombres, String apellidos);
    
    long countByActivoTrue();
}