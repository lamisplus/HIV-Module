package org.lamisplus.modules.hiv.installers;
    import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

    @Order(13)
    @Installer(name = "update-ndr-regimen-code-set-installer", description = "update ndr regimen resolver codeset", version = 1)
    public class NDRRegimenFixInstaller  extends AcrossLiquibaseInstaller {
        public NDRRegimenFixInstaller () {
            super("classpath:installers/hiv/schema/ndrRegimenFixSchema.xml");
        }
    }
