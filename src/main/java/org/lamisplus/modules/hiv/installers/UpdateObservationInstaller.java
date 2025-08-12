package org.lamisplus.modules.hiv.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(6)
@Installer(name = "update-observation",
        description = "remove unique type constraint",
        version = 3)
public class UpdateObservationInstaller extends AcrossLiquibaseInstaller {
    public UpdateObservationInstaller() {
        super("classpath:installers/hiv/schema/update-observation.xml");
    }
}
