package com.hospitalsr.repositories;
import com.hospitalsr.entities.Programacion;
import com.hospitalsr.entities.ProgramacionDetalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
@Repository
public interface ProgramacionDetalleRepo extends JpaRepository<ProgramacionDetalle, Long> {
    List<ProgramacionDetalle> findByProgramacion(Programacion programacion);
    @Query("SELECT pd FROM ProgramacionDetalle pd WHERE pd.programacion.mes = :mes AND pd.programacion.anio = :anio")
    List<ProgramacionDetalle> findByMesAndAnio(@Param("mes") int mes, @Param("anio") int anio);
}
