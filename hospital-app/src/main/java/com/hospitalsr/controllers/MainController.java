package com.hospitalsr.controllers;

import com.hospitalsr.entities.*;
import com.hospitalsr.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Controller
public class MainController {

    @Autowired private EstudianteRepo estudianteRepo;
    @Autowired private EspecialidadRepo especialidadRepo;
    @Autowired private AccesoRepo accesoRepo;
    @Autowired private UsuarioSistemaRepo usuarioRepo;
    @Autowired private TutorRepo tutorRepo;
    @Autowired private ProgramacionRepo programacionRepo;
    @Autowired private ProgramacionDetalleRepo detalleRepo;
    @Autowired private UniversidadRepo universidadRepo;

    @GetMapping("/login")
    public String login() {
        return "login";
    }

    // ==========================================
    // 1. DASHBOARD GENERAL
    // ==========================================
    @GetMapping({"/", "/dashboard"})
    public String dashboard(Model model, Authentication auth) {

        addUserToModel(model, auth);

        long totalEstudiantes = estudianteRepo.countByActivoTrue();
        long estudiantesDentro = accesoRepo.countEstudiantesDentro();

        List<Especialidad> areas = especialidadRepo.findAll();
        List<Acceso> presentes = accesoRepo.findEstudiantesDentro();

        model.addAttribute("conteoActivos", totalEstudiantes);
        model.addAttribute("conteoHospital", estudiantesDentro);
        model.addAttribute("conteoAreas", (long) areas.size());
        model.addAttribute("alertasActivas", 0);
        model.addAttribute("areas", areas);
        model.addAttribute("estudiantesEnSede", presentes);
        model.addAttribute("activePage", "dashboard");

        return "dashboard";
    }

    // ==========================================
    // 2. PANEL DE PRESENCIA
    // ==========================================
    @GetMapping("/presencia")
    public String presencia(Model model, Authentication auth) {

        addUserToModel(model, auth);

        long totalEstudiantes = estudianteRepo.countByActivoTrue();
        long estudiantesDentro = accesoRepo.countEstudiantesDentro();

        List<Especialidad> areas = especialidadRepo.findAll();
        List<Acceso> presentes = accesoRepo.findEstudiantesDentro();

        model.addAttribute("conteoActivos", totalEstudiantes);
        model.addAttribute("conteoHospital", estudiantesDentro);
        model.addAttribute("alertasActivas", 0);
        model.addAttribute("areas", areas);
        model.addAttribute("estudiantesEnSede", presentes);
        model.addAttribute("activePage", "presencia");

        return "presencia";
    }

    @PostMapping("/presencia/checkin")
    public String checkIn(@RequestParam String cedula,
                          Model model,
                          Authentication auth) {

        Optional<Estudiante> estOpt =
                estudianteRepo.findByDocumento(cedula.trim());

        if (estOpt.isPresent()) {

            Estudiante est = estOpt.get();

            Optional<Acceso> existente =
                    accesoRepo.findByEstudianteAndEstado(est, "DENTRO");

            if (existente.isEmpty()) {

                Acceso acceso = new Acceso(
                        est,
                        LocalDate.now(),
                        LocalDateTime.now(),
                        "DENTRO"
                );

                accesoRepo.save(acceso);

                model.addAttribute(
                        "mensaje",
                        "Check-in exitoso: " + est.getNombreCompleto()
                );

                model.addAttribute("tipoMensaje", "success");

            } else {

                model.addAttribute(
                        "mensaje",
                        "El estudiante ya está registrado como DENTRO"
                );

                model.addAttribute("tipoMensaje", "warning");
            }

        } else {

            model.addAttribute(
                    "mensaje",
                    "No se encontró estudiante con cédula: " + cedula
            );

            model.addAttribute("tipoMensaje", "error");
        }

        return presenciaRedirect(model, auth);
    }

    @PostMapping("/presencia/checkout")
    public String checkOut(@RequestParam String cedula,
                           Model model,
                           Authentication auth) {

        Optional<Estudiante> estOpt =
                estudianteRepo.findByDocumento(cedula.trim());

        if (estOpt.isPresent()) {

            Estudiante est = estOpt.get();

            Optional<Acceso> accesoOpt =
                    accesoRepo.findByEstudianteAndEstado(est, "DENTRO");

            if (accesoOpt.isPresent()) {

                Acceso acceso = accesoOpt.get();

                acceso.setHoraSalida(LocalDateTime.now());
                acceso.setEstado("FUERA");

                accesoRepo.save(acceso);

                model.addAttribute(
                        "mensaje",
                        "Check-out exitoso: " + est.getNombreCompleto()
                );

                model.addAttribute("tipoMensaje", "success");

            } else {

                model.addAttribute(
                        "mensaje",
                        "El estudiante no tiene check-in activo"
                );

                model.addAttribute("tipoMensaje", "warning");
            }

        } else {

            model.addAttribute(
                    "mensaje",
                    "No se encontró estudiante con cédula: " + cedula
            );

            model.addAttribute("tipoMensaje", "error");
        }

        return presenciaRedirect(model, auth);
    }

    private String presenciaRedirect(Model model, Authentication auth) {

        addUserToModel(model, auth);

        model.addAttribute(
                "conteoActivos",
                estudianteRepo.countByActivoTrue()
        );

        model.addAttribute(
                "conteoHospital",
                accesoRepo.countEstudiantesDentro()
        );

        model.addAttribute("alertasActivas", 0);
        model.addAttribute("areas", especialidadRepo.findAll());

        model.addAttribute(
                "estudiantesEnSede",
                accesoRepo.findEstudiantesDentro()
        );

        model.addAttribute("activePage", "presencia");

        return "presencia";
    }

    // ==========================================
    // 3. GESTIÓN DE ESTUDIANTES
    // ==========================================
    @GetMapping("/estudiantes")
    public String estudiantes(Model model,
                               Authentication auth,
                               @RequestParam(required = false) String buscar) {

        addUserToModel(model, auth);

        List<Estudiante> lista;

        if (buscar != null && !buscar.isBlank()) {

            lista =
                    estudianteRepo
                            .findByNombresContainingIgnoreCaseOrApellidosContainingIgnoreCase(
                                    buscar,
                                    buscar
                            );

        } else {

            lista = estudianteRepo.findByActivoTrue();
        }

        model.addAttribute("estudiantes", lista);
        model.addAttribute("buscar", buscar);

        model.addAttribute(
                "universidades",
                universidadRepo.findByEstadoTrue()
        );

        model.addAttribute("activePage", "estudiantes");

        return "estudiantes";
    }

    @PostMapping("/estudiantes/guardar")
    public String guardarEstudiante(@ModelAttribute Estudiante estudiante,
                                    @RequestParam Long universidadId,
                                    @RequestParam(required = false) Long estudianteId) {

        Universidad univ =
                universidadId != null
                        ? universidadRepo.findById(universidadId).orElse(null)
                        : null;

        estudiante.setUniversidad(univ);

        if (estudianteId != null) {
            estudiante.setId(estudianteId);
        }

        estudianteRepo.save(estudiante);

        return "redirect:/estudiantes";
    }

    @PostMapping("/estudiantes/eliminar/{id}")
    public String eliminarEstudiante(@PathVariable("id") long id) {

        estudianteRepo.findById(id).ifPresent(e -> {
            e.setActivo(false);
            estudianteRepo.save(e);
        });

        return "redirect:/estudiantes";
    }

    // ==========================================
    // 4. GESTIÓN DE USUARIOS
    // ==========================================
    @GetMapping("/usuarios")
    public String usuarios(Model model, Authentication auth) {

        addUserToModel(model, auth);

        model.addAttribute("usuarios", usuarioRepo.findAll());
        model.addAttribute("activePage", "usuarios");

        return "usuarios";
    }

    // ===== NUEVA RUTA =====
    @GetMapping("/usuarios/nuevo")
    public String nuevoUsuario(Model model, Authentication auth) {

        addUserToModel(model, auth);

        model.addAttribute("activePage", "usuarios");

        return "nuevo-usuario";
    }

    @PostMapping("/usuarios/guardar")
    public String guardarUsuario(@RequestParam String nombre,
                                 @RequestParam String username,
                                 @RequestParam String password,
                                 @RequestParam String cedula,
                                 @RequestParam String rol,
                                 @RequestParam(required = false) Long usuarioId) {

        UsuarioSistema u =
                (usuarioId != null)
                        ? usuarioRepo.findById(usuarioId)
                            .orElse(new UsuarioSistema())
                        : new UsuarioSistema();

        u.setNombre(nombre);
        u.setUsername(username);
        u.setCedula(cedula);
        u.setRol(rol);

        if (password != null && !password.isBlank()) {

            u.setPassword(
                    new org.springframework.security.crypto.bcrypt
                            .BCryptPasswordEncoder()
                            .encode(password)
            );
        }

        usuarioRepo.save(u);

        return "redirect:/usuarios";
    }

    @PostMapping("/usuarios/eliminar/{id}")
    public String eliminarUsuario(@PathVariable long id) {

        usuarioRepo.deleteById(id);

        return "redirect:/usuarios";
    }

    // ==========================================
    // 5. GESTIÓN DE ÁREAS
    // ==========================================
    @GetMapping("/areas")
    public String areas(Model model, Authentication auth) {

        addUserToModel(model, auth);

        model.addAttribute("areas", especialidadRepo.findAll());
        model.addAttribute("activePage", "areas");

        return "areas";
    }

    @PostMapping("/areas/guardar")
    public String guardarArea(@RequestParam String nombre,
                              @RequestParam String sede,
                              @RequestParam Integer capacidadMaxima,
                              @RequestParam(required = false) Long areaId) {

        Especialidad e =
                areaId != null
                        ? especialidadRepo.findById(areaId)
                            .orElse(new Especialidad())
                        : new Especialidad();

        e.setNombre(nombre);
        e.setSede(sede);
        e.setCapacidadMaxima(capacidadMaxima);

        especialidadRepo.save(e);

        return "redirect:/areas";
    }

    @PostMapping("/areas/eliminar/{id}")
    public String eliminarArea(@PathVariable Long id) {

        if (id != null) {
            especialidadRepo.deleteById(id);
        }

        return "redirect:/areas";
    }

    // ==========================================
    // 6. HORARIOS
    // ==========================================
    @GetMapping("/horarios")
    public String horarios(Model model, Authentication auth) {

        addUserToModel(model, auth);

        model.addAttribute(
                "estudiantes",
                estudianteRepo.findByActivoTrue()
        );

        model.addAttribute("tutores", tutorRepo.findAll());

        model.addAttribute(
                "areas",
                especialidadRepo.findAll()
        );

        model.addAttribute("detalles", detalleRepo.findAll());

        model.addAttribute("activePage", "horarios");

        return "horarios";
    }

    @PostMapping("/horarios/guardar")
    public String guardarHorario(@RequestParam long estudianteId,
                                 @RequestParam long tutorId,
                                 @RequestParam long areaId,
                                 @RequestParam String fecha,
                                 @RequestParam String horaInicio,
                                 @RequestParam String horaFin) {

        Estudiante est =
                estudianteRepo.findById(estudianteId).orElse(null);

        Especialidad area =
                especialidadRepo.findById(areaId).orElse(null);

        Tutor tutor =
                tutorRepo.findById(tutorId).orElse(null);

        if (est == null || area == null) {
            return "redirect:/horarios";
        }

        LocalDate fechaLocal = LocalDate.parse(fecha);

        int mes = fechaLocal.getMonthValue();
        int anio = fechaLocal.getYear();

        Programacion prog =
                programacionRepo
                        .findByEstudianteAndMesAndAnio(est, mes, anio)
                        .orElseGet(() -> {

                            Programacion p =
                                    new Programacion(est, mes, anio);

                            p.setTutorHospital(tutor);

                            return programacionRepo.save(p);
                        });

        ProgramacionDetalle det = new ProgramacionDetalle();

        det.setProgramacion(prog);
        det.setFecha(fechaLocal);

        det.setHoraInicio(
                java.time.LocalTime.parse(horaInicio)
        );

        det.setHoraFin(
                java.time.LocalTime.parse(horaFin)
        );

        det.setEspecialidad(area);

        detalleRepo.save(det);

        return "redirect:/horarios";
    }

    // ==========================================
    // 7. CRONOGRAMA
    // ==========================================
    @GetMapping("/cronograma")
    public String cronograma(Model model,
                             Authentication auth,
                             @RequestParam(required = false) Integer mes,
                             @RequestParam(required = false) Integer anio) {

        addUserToModel(model, auth);

        LocalDate now = LocalDate.now();

        int m = mes != null ? mes : now.getMonthValue();
        int a = anio != null ? anio : now.getYear();

        List<ProgramacionDetalle> detalles =
                detalleRepo.findByMesAndAnio(m, a);

        List<Estudiante> estudiantes =
                estudianteRepo.findByActivoTrue();

        model.addAttribute("detalles", detalles);
        model.addAttribute("estudiantes", estudiantes);

        model.addAttribute("mes", m);
        model.addAttribute("anio", a);

        model.addAttribute("activePage", "cronograma");

        return "cronograma";
    }

    // ==========================================
    // 8. REPORTES
    // ==========================================
    @GetMapping("/reportes")
    public String reportes(Model model, Authentication auth) {

        addUserToModel(model, auth);

        model.addAttribute(
                "totalEstudiantes",
                estudianteRepo.countByActivoTrue()
        );

        model.addAttribute(
                "areas",
                especialidadRepo.findAll()
        );

        model.addAttribute(
                "estudiantes",
                estudianteRepo.findByActivoTrue()
        );

        model.addAttribute("activePage", "reportes");

        return "reportes";
    }

    private void addUserToModel(Model model, Authentication auth) {

        if (auth != null) {

            usuarioRepo.findByUsername(auth.getName()).ifPresent(u -> {

                model.addAttribute("usuarioActual", u);

            });
        }
    }
}