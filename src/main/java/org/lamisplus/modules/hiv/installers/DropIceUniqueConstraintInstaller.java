package org.lamisplus.modules.hiv.installers;

import com.foreach.across.core.annotations.Installer;
import com.foreach.across.core.installers.AcrossLiquibaseInstaller;
import org.springframework.core.annotation.Order;

@Order(111)
@Installer(
        name = "drop-ice-unique-constraint-installer",
        description = "Drops ICE unique constraint to allow multiple enrollment cycles per patient",
        version = 1
)
public class DropIceUniqueConstraintInstaller extends AcrossLiquibaseInstaller {

    public DropIceUniqueConstraintInstaller() {
        super("classpath:installers/hiv/schema/drop-ice-unique-constraint.xml");
    }
}
