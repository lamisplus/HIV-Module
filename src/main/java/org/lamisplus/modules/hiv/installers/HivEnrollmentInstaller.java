 package org.lamisplus.modules.hiv.installers;

 import com.foreach.across.core.annotations.Installer;
 import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
 import org.springframework.core.annotation.Order;

 @Order(1)
 @Installer(name = "schema-installer",
         description = "Installs the required database tables",
         version = 4)
 public class HivEnrollmentInstaller extends AcrossLiquibaseInstaller {
     public HivEnrollmentInstaller() {
         super("classpath:installers/hiv/schema/schema.xml");
     }
 }
