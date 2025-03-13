import { createFileRoute } from "@tanstack/react-router";

import { Terminal } from "~/components/ui/terminal";
import { CrtScreen } from "~/components/ui/crt-screen";
import {
  achievements,
  certifications,
  skills,
  workExperience,
} from "~/data/james";
import {
  default_commands,
  buildSkillCommand,
  buildCertificationsCommand,
  buildWorkExperienceCommand,
  buildAchievementsCommand,
} from "~/lib/commands";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="min-h-screen min-w-screen bg-slate-700 py-12">
      <div className="container mx-auto max-w-7xl px-4 py-4">
        <div className="terminal-wrapper rounded-lg border-2 border-slate-500 shadow-lg">
          {/* <Terminal
            className="rounded-lg border border-slate-600"
            options={{
              theme: {
                background: "#1a1b26",
                foreground: "#a9b1d6",
                cursor: "#c0caf5",
              },
              fontSize: 16,
              cursorBlink: true,
              fontFamily: '"VT323", "Press Start 2P", monospace',
              lineHeight: 1.25,
              letterSpacing: 1.65,
              cols: 140,
              rows: 34,
            }}
            // style={{
            //   filter: "blur(0.25px) brightness(1.1)",
            //   textShadow: "0 0 1px currentColor",
            // }}
            commands={[
              ...default_commands,
              buildSkillCommand(skills),
              buildWorkExperienceCommand(workExperience),
              buildCertificationsCommand(certifications),
              buildAchievementsCommand(achievements),
            ]}
          /> */}
          {/* <div
            className="overflow-hidden rounded-lg border-2 p-8 shadow-lg"
            style={{
              background: `repeating-linear-gradient(
                90deg,
                rgba(255,0,0,1.0),
                rgba(255,0,0,1.0) 20px,
                rgba(0,255,0,1.0) 20px,
                rgba(0,255,0,1.0) 40px,
                rgba(0,0,255,1.0) 40px,
                rgba(0,0,255,1.0) 60px
              )`,
            }}
          >
            <div className="h-[800px] w-full" />
          </div> */}
          <div className="h-[800px] w-full overflow-scroll overflow-x-hidden scroll-auto bg-slate-800 p-4 font-mono text-2xl text-white">
            <h2 className="mb-6 text-3xl">CRT Filter Effects</h2>

            <h3 className="mb-4 text-2xl">Chromatic Aberration</h3>
            <div className="mb-8 grid grid-cols-2 gap-4">
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Subtle Aberration</h3>
                <CrtScreen chromaticStrength="subtle">
                  <div className="bg-slate-900 p-4">
                    This text has subtle chromatic aberration
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Normal Aberration</h3>
                <CrtScreen chromaticStrength="normal">
                  <div className="bg-slate-900 p-4">
                    This text has normal chromatic aberration
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Strong Aberration</h3>
                <CrtScreen chromaticStrength="strong">
                  <div className="bg-slate-900 p-4">
                    This text has strong chromatic aberration
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Extreme Aberration</h3>
                <CrtScreen chromaticStrength="extreme">
                  <div className="bg-slate-900 p-4">
                    This text has extreme chromatic aberration
                  </div>
                </CrtScreen>
              </div>
            </div>

            <h3 className="mb-4 text-2xl">Text Bloom</h3>
            <div className="mb-8 grid grid-cols-2 gap-4">
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Default Bloom</h3>
                <CrtScreen bloomType="default">
                  <div className="bg-slate-900 p-4">
                    This text has default bloom effect
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Green Bloom</h3>
                <CrtScreen bloomType="green">
                  <div className="bg-slate-900 p-4">
                    This text has green bloom effect
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Amber Bloom</h3>
                <CrtScreen bloomType="amber">
                  <div className="bg-slate-900 p-4">
                    This text has amber bloom effect
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Blue-White Bloom</h3>
                <CrtScreen bloomType="blue-white">
                  <div className="bg-slate-900 p-4">
                    This text has blue-white bloom effect
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Subtle Bloom</h3>
                <CrtScreen bloomType="subtle">
                  <div className="bg-slate-900 p-4">
                    This text has subtle bloom effect
                  </div>
                </CrtScreen>
              </div>
            </div>

            <h3 className="mb-4 text-2xl">RGB Pixel Effect</h3>
            <div className="mb-8 grid grid-cols-2 gap-4">
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Default RGB Pixels</h3>
                <CrtScreen rgbPixelOpacity={0.2}>
                  <div className="bg-slate-900 p-4">
                    This text has the RGB pixel effect
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Subtle RGB Pixels</h3>
                <CrtScreen rgbPixelOpacity={0.1}>
                  <div className="bg-slate-900 p-4">
                    This text has subtle RGB pixel effect
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Strong RGB Pixels</h3>
                <CrtScreen rgbPixelOpacity={0.3}>
                  <div className="bg-slate-900 p-4">
                    This text has stronger RGB pixel effect
                  </div>
                </CrtScreen>
              </div>
            </div>

            <h3 className="mb-4 text-2xl">Screen Glow</h3>
            <div className="mb-8 grid grid-cols-2 gap-4">
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Green Glow</h3>
                <CrtScreen glowColor="green">
                  <div className="bg-slate-900 p-4">
                    This text has a green screen glow
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Amber Glow</h3>
                <CrtScreen glowColor="amber">
                  <div className="bg-slate-900 p-4">
                    This text has an amber screen glow
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Blue-White Glow</h3>
                <CrtScreen glowColor="blue-white">
                  <div className="bg-slate-900 p-4">
                    This text has a blue-white screen glow
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">White Glow</h3>
                <CrtScreen glowColor="white">
                  <div className="bg-slate-900 p-4">
                    This text has a white screen glow
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Strong Glow</h3>
                <CrtScreen glowColor="blue-white" glowOpacity={0.9}>
                  <div className="bg-slate-900 p-4">
                    This text has a stronger screen glow
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Subtle Glow</h3>
                <CrtScreen glowColor="blue-white" glowOpacity={0.5}>
                  <div className="bg-slate-900 p-4">
                    This text has a subtle screen glow
                  </div>
                </CrtScreen>
              </div>
            </div>

            <h3 className="mb-4 text-2xl">Vignette Effect</h3>
            <div className="mb-8 grid grid-cols-2 gap-4">
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Default Vignette</h3>
                <CrtScreen vignetteIntensity={0.8}>
                  <div className="bg-slate-900 p-4">
                    This text has the default vignette effect
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Subtle Vignette</h3>
                <CrtScreen vignetteIntensity={0.5}>
                  <div className="bg-slate-900 p-4">
                    This text has a subtle vignette effect
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Strong Vignette</h3>
                <CrtScreen vignetteIntensity={1}>
                  <div className="bg-slate-900 p-4">
                    This text has a strong vignette effect
                  </div>
                </CrtScreen>
              </div>
            </div>

            <h3 className="mb-4 text-2xl">Scanline Effect</h3>
            <div className="mb-8 grid grid-cols-2 gap-4">
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Default Scanlines</h3>
                <CrtScreen scanlineOpacity={0.15}>
                  <div className="bg-slate-900 p-4">
                    This text has default scanlines
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Subtle Scanlines</h3>
                <CrtScreen scanlineOpacity={0.1}>
                  <div className="bg-slate-900 p-4">
                    This text has subtle scanlines
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Strong Scanlines</h3>
                <CrtScreen scanlineOpacity={0.25}>
                  <div className="bg-slate-900 p-4">
                    This text has strong scanlines
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Wide Scanlines</h3>
                <CrtScreen scanlineOpacity={0.15} scanlineSize={4}>
                  <div className="bg-slate-900 p-4">
                    This text has wider scanlines
                  </div>
                </CrtScreen>
              </div>
            </div>

            <h3 className="mb-4 text-2xl">Screen Curvature</h3>
            <div className="mb-8 grid grid-cols-2 gap-4">
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Default Curvature</h3>
                <CrtScreen curvatureIntensity={0.8}>
                  <div className="bg-slate-900 p-4">
                    This text has the default screen curvature
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Subtle Curvature</h3>
                <CrtScreen curvatureIntensity={0.5}>
                  <div className="bg-slate-900 p-4">
                    This text has subtle screen curvature
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Strong Curvature</h3>
                <CrtScreen curvatureIntensity={1}>
                  <div className="bg-slate-900 p-4">
                    This text has strong screen curvature
                  </div>
                </CrtScreen>
              </div>
            </div>

            <h3 className="mb-4 text-2xl">Screen Flicker</h3>
            <div className="mb-8 grid grid-cols-2 gap-4">
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">
                  Default Flicker (White Phosphor)
                </h3>
                <CrtScreen phosphorType="white-phosphor">
                  <div className="bg-slate-900 p-4">
                    This text has the default flicker effect
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Green Phosphor</h3>
                <CrtScreen phosphorType="green-phosphor">
                  <div className="bg-slate-900 p-4">
                    This text has green phosphor flicker
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Amber Phosphor</h3>
                <CrtScreen phosphorType="amber-tone">
                  <div className="bg-slate-900 p-4">
                    This text has amber phosphor flicker
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Blue-Green Phosphor</h3>
                <CrtScreen phosphorType="blue-green-phosphor">
                  <div className="bg-slate-900 p-4">
                    This text has blue-green phosphor flicker
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Sepia Tone</h3>
                <CrtScreen phosphorType="sepia-tone">
                  <div className="bg-slate-900 p-4">
                    This text has sepia tone flicker
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">90s Console Style</h3>
                <CrtScreen phosphorType="gradient">
                  <div className="bg-slate-900 p-4">
                    This text has gradient phosphor flicker
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Strong Flicker</h3>
                <CrtScreen phosphorType="white-phosphor" flickerOpacity={1.5}>
                  <div className="bg-slate-900 p-4">
                    This text has stronger flicker effect
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Subtle Flicker</h3>
                <CrtScreen phosphorType="white-phosphor" flickerOpacity={0.5}>
                  <div className="bg-slate-900 p-4">
                    This text has subtle flicker effect
                  </div>
                </CrtScreen>
              </div>
            </div>

            <h3 className="mb-4 text-2xl">Combined Effects</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">
                  Green Bloom + Strong Aberration + Green Glow
                </h3>
                <CrtScreen
                  bloomType="green"
                  chromaticStrength="strong"
                  glowColor="green"
                >
                  <div className="bg-slate-900 p-4">
                    This text has combined CRT effects
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">Blue-White Theme</h3>
                <CrtScreen
                  bloomType="blue-white"
                  chromaticStrength="normal"
                  glowColor="blue-white"
                >
                  <div className="bg-slate-900 p-4">
                    This text has combined CRT effects
                  </div>
                </CrtScreen>
              </div>
              <div className="rounded bg-slate-700 p-4">
                <h3 className="mb-2 text-xl">All Effects Combined</h3>
                <CrtScreen
                  bloomType="blue-white"
                  chromaticStrength="normal"
                  glowColor="blue-white"
                  rgbPixelOpacity={0.15}
                  vignetteIntensity={0.8}
                  scanlineOpacity={0.15}
                  curvatureIntensity={0.8}
                  phosphorType="white-phosphor"
                  flickerOpacity={0.8}
                >
                  <div className="bg-slate-900 p-4">
                    This text has all CRT effects applied
                  </div>
                </CrtScreen>
              </div>
            </div>
          </div>
          {/* <div className="crt-glow blue-white"></div> */}
          {/* <div className="crt-rgb"></div> */}
          {/* <div className="crt-vignette"></div> */}
          {/* <div className="crt-text-bloom blue-white"></div> */}
          {/* <div className="crt-scanlines"></div>
          <div className="crt-curvature"></div>
          <div className="crt-flicker white-phosphor"></div> */}
        </div>
      </div>
    </div>
  ),
});
