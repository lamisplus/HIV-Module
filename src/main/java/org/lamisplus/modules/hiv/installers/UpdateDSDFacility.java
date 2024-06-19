package org.lamisplus.modules.hiv.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(10)
@Installer(name = "update-base_application-codeset-for-dsd-Facility-model-type",
        description = "update base application codeset for dsd facility model type",
        version = 1)
public class UpdateDSDFacility  extends AcrossLiquibaseInstaller {
    public UpdateDSDFacility() {

        super("classpath:installers/hiv/schema/update_dsd_facility.xml");
    }
}